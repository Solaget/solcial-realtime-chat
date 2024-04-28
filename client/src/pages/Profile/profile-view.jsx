// Lib hooks 👇🏼
import { useSelector } from "react-redux";
// Components 👇🏼
import Header from "./common/header";
import AvatarSetting from "./common/avatar-setting";
import ProfileDetailSetting from "./common/profile-detail-setting";

const ProfileView = () => {
  const authInfo = useSelector((state) => state.auth.authInfo);

  return (
    <div className="w-full h-screen bg-yellow overflow-y-scroll px-2">
      <div className="flex flex-col gap-8">
        {/* Header */}
        <Header />
        <main className="flex flex-col gap-6 w-full sm:w-[70%] md:w-[50%] ">
          Avatar
          <AvatarSetting
            fullName={authInfo.fullName}
            avatar={authInfo.avatar}
          />

          {/* Proflie Fomrs */}
          <ProfileDetailSetting authInfo={authInfo} />
        </main>
      </div>
    </div>
  );
};

export default ProfileView;
