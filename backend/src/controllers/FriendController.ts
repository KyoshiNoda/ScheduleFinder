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
          message: `User is not friends with ${
            (friend.firstName, +' ' + friend.lastName)
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
      for (const friendID of user.friendRequests) {
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
    let pendingFriendRequests: IUser[] = [];
    try {
      const user = await User.findOne({ _id: userID }).exec();
      if (!user) {
        return res.status(404).send({
          message: `User ${userID} not found`,
        });
      }
      for (const friendID of user.pendingFriendRequests) {
        let friend = await User.findOne({ _id: friendID }).exec();
        if (friend) {
          pendingFriendRequests.push(friend);
        }
      }
      res.send(pendingFriendRequests);
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

      if (!user.pendingFriendRequests.includes(friendID)) {
        user.pendingFriendRequests.push(friendID);
        await user.save();
      } else {
        return res.status(404).send({
          message: 'Friend Request Already Send!',
        });
      }

      if (!friend.friendRequests.includes(userID)) {
        friend.friendRequests.push(userID);
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

      if (user.friendRequests.includes(friendID)) {
        user.friendRequests = user.friendRequests.filter(
          (id) => id !== friendID
        );
        await user.save();
      }

      if (friend.pendingFriendRequests.includes(userID)) {
        friend.pendingFriendRequests = friend.pendingFriendRequests.filter(
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
        !user.friendRequests.includes(friendID) ||
        !friend.friendRequests.includes(userID)
      ) {
        return res.status(404).send({
          message: 'Missing Friend Request',
        });
      }

      user.friends.push(friendID);
      user.friendRequests = user.friendRequests.filter((id) => id !== friendID);
      await user.save();

      friend.friends.push(userID);
      friend.pendingFriendRequests = friend.pendingFriendRequests.filter(
        (id) => id !== userID
      );
      await friend.save();

      const updatedUser = await User.findOne({ _id: userID }).exec();
      const updatedUserFriendRequests = await User.find({
        _id: { $in: updatedUser?.friendRequests },
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
      user.friendRequests = user.friendRequests.filter((id) => id !== friendID);
      await user.save();

      friend.friendRequests = friend.friendRequests.filter(
        (id) => id !== userID
      );
      await friend.save();

      const updatedUser = await User.findOne({ _id: userID }).exec();
      const updatedUserFriendRequests = await User.find({
        _id: { $in: updatedUser?.friendRequests },
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
}

export default FriendController;
