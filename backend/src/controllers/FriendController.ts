import User from '../models/userModel';
import { IUser } from '../models/userModel';
import sgMail from '@sendgrid/mail';
sgMail.setApiKey(`${process.env.SENDGRID_API_KEY}`);
class FriendController {
  public static async getFriends(req: any, res: any) {
    const userID: string = req.user.data._id;
    try {
      const user = await User.findOne({ _id: userID }).exec();

      if (!user) {
        return res.status(404).send({
          message: `User ${userID} not found`,
        });
      }

      // Populate the 'friends' field with user objects
      const userFriends = await User.find({
        _id: { $in: user.friends },
      }).exec();

      res.json(userFriends); // Return the array of friend objects
    } catch (err) {
      console.error(err);
      res.status(500).send({
        message: `Error while getting User ${userID}`,
        error: err,
      });
    }
  }

  public static async deleteFriend(req: any, res: any) {
    const userID: string = req.user.data._id;
    const friendID: string = req.params.friendID;
    try {
      const user = await User.findOne({ _id: userID }).exec();
      const friend = await User.findOne({ _id: friendID }).exec();
      if (!user || !friend) {
        return res.status(404).send({
          message: 'One of the users is missing!',
        });
      }
      if (!user.friends.includes(friendID)) {
        return res.status(404).send({
          message: `User is not friends with ${(friend.firstName, +' ' + friend.lastName)
            }`,
        });
      }
      user.friends = user.friends.filter((id) => id !== friendID);
      await user.save();
      friend.friends = friend.friends.filter((id) => id !== userID);
      await friend.save();
      const updatedUser = await User.findOne({ _id: userID }).exec();

      // Query for all the friends in the updated friend list
      const updatedUserFriends = await User.find({
        _id: { $in: updatedUser?.friends },
      }).exec();

      return res.status(200).send({
        message: 'Friend removed successfully!',
        friends: updatedUserFriends,
      });
    } catch (err) {
      console.error(err);
      res.status(500).send({
        message: `Error while getting User ${userID}`,
        error: err,
      });
    }
  }
  public static async getFriendRequests(req: any, res: any) {
    const userID: string = req.user.data._id;
    let userFriendRequests: IUser[] = [];
    try {
      const user = await User.findOne({ _id: userID }).exec();
      if (!user) {
        return res.status(404).send({
          message: `User ${userID} not found`,
        });
      }
      for (const friendID of user.receivedFriendRequests) {
        let friend = await User.findOne({ _id: friendID }).exec();
        if (friend) {
          userFriendRequests.push(friend);
        }
      }
      res.send(userFriendRequests);
    } catch (err) {
      console.error(err);
      res.status(500).send({
        message: `Error while getting User ${userID}`,
        error: err,
      });
    }
  }
  public static async getPendingFriendRequests(req: any, res: any) {
    const userID: string = req.user.data._id;
    let sentFriendRequests: IUser[] = [];
    try {
      const user = await User.findOne({ _id: userID }).exec();
      if (!user) {
        return res.status(404).send({
          message: `User ${userID} not found`,
        });
      }
      for (const friendID of user.sentFriendRequests) {
        let friend = await User.findOne({ _id: friendID }).exec();
        if (friend) {
          sentFriendRequests.push(friend);
        }
      }
      res.send(sentFriendRequests);
    } catch (err) {
      console.error(err);
      res.status(500).send({
        message: `Error while getting User ${userID}`,
        error: err,
      });
    }
  }

  public static async sendFriendRequest(req: any, res: any) {
    const userID: string = req.user.data._id;
    const friendID: string = req.params.friendID;
    try {
      const user = await User.findOne({ _id: userID }).exec();
      const friend = await User.findOne({ _id: friendID }).exec();
      if (!user || !friend) {
        return res.status(404).send({
          message: "One of the users doesn't exist!",
        });
      }

      if (!user.sentFriendRequests.includes(friendID)) {
        user.sentFriendRequests.push(friendID);
        await user.save();
      } else {
        return res.status(404).send({
          message: 'Friend Request Already Send!',
        });
      }

      if (!friend.receivedFriendRequests.includes(userID)) {
        friend.receivedFriendRequests.push(userID);
        await friend.save();
        const msg: sgMail.MailDataRequired = {
          to: friend.email,
          from: 'schedulefinder@gmail.com',
          subject: 'ScheduleFinder - Friend Request',
          text: `You have a new friend request from ${user.firstName} ${user.lastName}!`,
          html: `
            <div style="font-family: Arial, sans-serif; color: #fff; background-color: #3b82f6; padding: 20px;">
              <h2 style="color: #fff;">ScheduleFinder - Friend Request</h2>
              <p><strong>You have a new friend request from ${user.firstName} ${user.lastName}!</strong></p>
              <div style="display: flex; justify-content: space-between;">
                <ul style="margin-right: 20px;">
                  <li>First Name: ${user.firstName}</li>
                  <li>Last Name: ${user.lastName}</li>
                  <li>School: ${user.school}</li>
                  <li>Major: ${user.major ? user.major : 'N/A'}</li>
                </ul>
                <img src="${user.photoURL}" alt="Friend's Photo" style="border-radius: 50%; width: 100px; height: 100px; align-self: flex-start;">
              </div>
              <p>Please <a href="https://schedulefinder.netlify.app/" style="color: #fff; text-decoration: underline;">log in</a> to your account to accept or decline this request.</p>
            </div>
          `,
        };
        await sgMail.send(msg);
      } else {
        return res.status(404).send({
          message: 'Friend Request Already Send!',
        });
      }

      return res.status(200).send({
        message: 'Friend request sent successfully!',
      });
    } catch (err) {
      console.error(err);
      res.status(500).send({
        message: `Error while getting User ${userID}`,
        error: err,
      });
    }
  }

  public static async removeFriendRequest(req: any, res: any) {
    const userID: string = req.user.data._id;
    const friendID: string = req.params.friendID;
    try {
      const user = await User.findOne({ _id: userID }).exec();
      const friend = await User.findOne({ _id: friendID }).exec();
      if (!user || !friend) {
        return res.status(404).send({
          message: "One of the users doesn't exist!",
        });
      }

      if (user.receivedFriendRequests.includes(friendID)) {
        user.receivedFriendRequests = user.receivedFriendRequests.filter(
          (id) => id !== friendID
        );
        await user.save();
      }

      if (friend.sentFriendRequests.includes(userID)) {
        friend.sentFriendRequests = friend.sentFriendRequests.filter(
          (id) => id !== userID
        );
        await friend.save();
      }

      return res.status(200).send({
        message: 'Removed friend request successfully!',
      });
    } catch (err) {
      console.error(err);
      res.status(500).send({
        message: `Error while getting User ${userID}`,
        error: err,
      });
    }
  }

  public static async acceptFriendRequest(req: any, res: any) {
    const userID: string = req.user.data._id;
    const friendID: string = req.params.friendID;
    try {
      const user = await User.findOne({ _id: userID }).exec();
      const friend = await User.findOne({ _id: friendID }).exec();
      if (!user || !friend) {
        return res.status(404).send({
          message: "One of the users doesn't exist!",
        });
      }
      if (
        !user.receivedFriendRequests.includes(friendID) ||
        !friend.sentFriendRequests.includes(userID)
      ) {
        return res.status(404).send({
          message: 'Missing Friend Request',
        });
      }

      user.friends.push(friendID);
      user.receivedFriendRequests = user.receivedFriendRequests.filter((id) => id !== friendID);
      await user.save();

      friend.friends.push(userID);
      friend.sentFriendRequests = friend.sentFriendRequests.filter(
        (id) => id !== userID
      );
      await friend.save();

      const updatedUser = await User.findOne({ _id: userID }).exec();
      const updatedUserFriendRequests = await User.find({
        _id: { $in: updatedUser?.receivedFriendRequests },
      }).exec();

      res.status(200).send({
        message: 'Added friend successfully!',
        updatedFriendRequests: updatedUserFriendRequests,
      });
    } catch (err) {
      console.error(err);
      res.status(500).send({
        message: `Error while getting User ${userID}`,
        error: err,
      });
    }
  }
  public static async rejectFriendRequest(req: any, res: any) {
    const userID: string = req.user.data._id;
    const friendID: string = req.params.friendID;
    try {
      const user = await User.findOne({ _id: userID }).exec();
      const friend = await User.findOne({ _id: friendID }).exec();
      if (!user || !friend) {
        return res.status(404).send({
          message: "One of the users doesn't exist!",
        });
      }
      user.receivedFriendRequests = user.receivedFriendRequests.filter((id) => id !== friendID);
      await user.save();

      friend.sentFriendRequests = friend.sentFriendRequests.filter(
        (id) => id !== userID
      );
      await friend.save();

      const updatedUser = await User.findOne({ _id: userID }).exec();
      const updatedUserFriendRequests = await User.find({
        _id: { $in: updatedUser?.receivedFriendRequests },
      }).exec();

      res.status(200).send({
        message: 'Friend Request was ignored!',
        updatedFriendRequests: updatedUserFriendRequests,
      });
    } catch (err) {
      console.error(err);
      res.status(500).send({
        message: `Error while getting User ${userID}`,
        error: err,
      });
    }
  }

  public static async cancelPendingFriendRequest(req: any, res: any) {
    const userID: string = req.user.data._id;
    const friendID: string = req.params.friendID;
    try {
      const user = await User.findOne({ _id: userID }).exec();
      const friend = await User.findOne({ _id: friendID }).exec();

      if (!user || !friend) {
        return res.status(404).send({
          message: "One of the users doesn't exist!",
        });
      }
      user.sentFriendRequests = user.sentFriendRequests.filter((id) => id !== friend.id);
      await user.save();

      friend.receivedFriendRequests = friend.receivedFriendRequests.filter((id) => id !== user.id);
      await friend.save();

      const updatedUser = await User.findOne({ _id: userID }).exec();
      const updatedSendFriendRequests = await User.find({
        _id: { $in: updatedUser?.sentFriendRequests },
      }).exec();

      res.status(200).send({
        message: 'Cancelled Friend Request!',
        updatedSendFriendRequests: updatedSendFriendRequests,
      });

    } catch (err) {
      console.error(err);
      res.status(500).send({
        message: `Error while getting User ${userID}`,
        error: err,
      });
    }

  }

}

export default FriendController;
