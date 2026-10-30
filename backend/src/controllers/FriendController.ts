import { Request, Response } from 'express';
import sgMail from '@sendgrid/mail';
import User, { IUser } from '../models/userModel';
import { toPublicUser } from '../representations/userRepresentation';
import {
  FriendRequestNotification,
  mutateRelationship,
  RelationshipMutationError,
  RelationshipMutationResult,
} from '../relationships/relationshipMutations';
import { FriendIdParams } from '../validation/schemas';

sgMail.setApiKey(`${process.env.SENDGRID_API_KEY}`);

const getPublicUsers = async (ids: string[]) => {
  const users = await User.find({ _id: { $in: ids } }).exec();
  return users.map(toPublicUser);
};

const sendRelationshipMutationError = (res: Response, error: unknown) => {
  if (error instanceof RelationshipMutationError) {
    return res.status(error.status).json({ error: error.message, code: error.code });
  }

  return res.status(500).json({ error: 'Unable to update relationship.' });
};

const sendFriendRequestNotification = async (
  notification: FriendRequestNotification
): Promise<void> => {
  const senderName = `${notification.senderFirstName} ${notification.senderLastName}`;

  await sgMail.send({
    to: notification.recipientEmail,
    from: 'schedulefinder@gmail.com',
    subject: 'ScheduleFinder - Friend Request',
    text: `You have a new friend request from ${senderName}. Log in to ScheduleFinder to respond.`,
  });
};

const sendNotificationAfterCommit = async (
  result: RelationshipMutationResult
): Promise<void> => {
  if (!result.notification) {
    return;
  }

  try {
    await sendFriendRequestNotification(result.notification);
  } catch {
    console.error('Unable to send friend-request notification after the request committed.');
  }
};

class FriendController {
  public static async getFriends(req: Request, res: Response) {
    const userID: string = req.auth.userId;
    try {
      const user = await User.findOne({ _id: userID }).exec();

      if (!user) {
        return res.status(404).send({
          message: `User ${userID} not found`,
        });
      }

      const userFriends = await User.find({
        _id: { $in: user.friends },
      }).exec();

      return res.json(userFriends.map(toPublicUser));
    } catch (err) {
      console.error(err);
      return res.status(500).send({
        message: `Error while getting User ${userID}`,
        error: err,
      });
    }
  }

  public static async deleteFriend(req: Request<FriendIdParams>, res: Response) {
    const userID: string = req.auth.userId;
    const friendID: string = req.params.friendID;

    try {
      const result = await mutateRelationship(userID, friendID, 'unfriend');
      const friends = await getPublicUsers(result.actorRelationships.friends);

      return res.status(200).send({
        message: 'Friend removed successfully!',
        friends,
      });
    } catch (error) {
      return sendRelationshipMutationError(res, error);
    }
  }

  public static async getFriendRequests(req: Request, res: Response) {
    const userID: string = req.auth.userId;
    const userFriendRequests: IUser[] = [];
    try {
      const user = await User.findOne({ _id: userID }).exec();
      if (!user) {
        return res.status(404).send({
          message: `User ${userID} not found`,
        });
      }
      for (const friendID of user.receivedFriendRequests) {
        const friend = await User.findOne({ _id: friendID }).exec();
        if (friend) {
          userFriendRequests.push(friend);
        }
      }
      return res.send(userFriendRequests.map(toPublicUser));
    } catch (err) {
      console.error(err);
      return res.status(500).send({
        message: `Error while getting User ${userID}`,
        error: err,
      });
    }
  }

  public static async getPendingFriendRequests(req: Request, res: Response) {
    const userID: string = req.auth.userId;
    const sentFriendRequests: IUser[] = [];
    try {
      const user = await User.findOne({ _id: userID }).exec();
      if (!user) {
        return res.status(404).send({
          message: `User ${userID} not found`,
        });
      }
      for (const friendID of user.sentFriendRequests) {
        const friend = await User.findOne({ _id: friendID }).exec();
        if (friend) {
          sentFriendRequests.push(friend);
        }
      }
      return res.send(sentFriendRequests.map(toPublicUser));
    } catch (err) {
      console.error(err);
      return res.status(500).send({
        message: `Error while getting User ${userID}`,
        error: err,
      });
    }
  }

  public static async sendFriendRequest(req: Request<FriendIdParams>, res: Response) {
    const userID: string = req.auth.userId;
    const friendID: string = req.params.friendID;

    try {
      const result = await mutateRelationship(userID, friendID, 'send');
      await sendNotificationAfterCommit(result);

      return res.status(200).send({
        message:
          result.outcome === 'friendship-created'
            ? 'Friend request accepted successfully!'
            : 'Friend request sent successfully!',
      });
    } catch (error) {
      return sendRelationshipMutationError(res, error);
    }
  }

  public static async removeFriendRequest(req: Request<FriendIdParams>, res: Response) {
    const userID: string = req.auth.userId;
    const friendID: string = req.params.friendID;

    try {
      await mutateRelationship(userID, friendID, 'reject');

      return res.status(200).send({
        message: 'Removed friend request successfully!',
      });
    } catch (error) {
      return sendRelationshipMutationError(res, error);
    }
  }

  public static async acceptFriendRequest(req: Request<FriendIdParams>, res: Response) {
    const userID: string = req.auth.userId;
    const friendID: string = req.params.friendID;

    try {
      const result = await mutateRelationship(userID, friendID, 'accept');
      const updatedFriendRequests = await getPublicUsers(
        result.actorRelationships.receivedFriendRequests
      );

      return res.status(200).send({
        message: 'Added friend successfully!',
        updatedFriendRequests,
      });
    } catch (error) {
      return sendRelationshipMutationError(res, error);
    }
  }

  public static async rejectFriendRequest(req: Request<FriendIdParams>, res: Response) {
    const userID: string = req.auth.userId;
    const friendID: string = req.params.friendID;

    try {
      const result = await mutateRelationship(userID, friendID, 'reject');
      const updatedFriendRequests = await getPublicUsers(
        result.actorRelationships.receivedFriendRequests
      );

      return res.status(200).send({
        message: 'Friend Request was ignored!',
        updatedFriendRequests,
      });
    } catch (error) {
      return sendRelationshipMutationError(res, error);
    }
  }

  public static async cancelPendingFriendRequest(req: Request<FriendIdParams>, res: Response) {
    const userID: string = req.auth.userId;
    const friendID: string = req.params.friendID;

    try {
      const result = await mutateRelationship(userID, friendID, 'cancel');
      const updatedSendFriendRequests = await getPublicUsers(
        result.actorRelationships.sentFriendRequests
      );

      return res.status(200).send({
        message: 'Cancelled Friend Request!',
        updatedSendFriendRequests,
      });
    } catch (error) {
      return sendRelationshipMutationError(res, error);
    }
  }
}

export default FriendController;
