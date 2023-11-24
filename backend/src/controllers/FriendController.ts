import User from '../models/userModel';
import { IUser } from '../models/userModel';
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

      friend.receivedFriendRequests = user.receivedFriendRequests.filter((id) => id !== user.id);
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
