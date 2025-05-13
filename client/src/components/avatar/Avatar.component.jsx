import UserTieIcon from "../icons/UserTie.component";
import { useSelector } from "react-redux";
import cn from "classnames";

const Avatar = ({ className, ...props }) => {
  const user = useSelector((state) => state.user.currentUser);

  const avatarIcon = user.avatar ? (
    <div className={cn("defaultAva", className)} {...props}>
      <img src={process.env.REACT_APP_API_URL + user.avatar} alt="" />
    </div>
  ) : (
    <div className={cn("defaultAva", className)} {...props}>
      <UserTieIcon />
    </div>
  );

  return avatarIcon;
};

export default Avatar;
