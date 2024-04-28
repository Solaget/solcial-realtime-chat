// Header 👇🏼
import Header from "@/components/main/header";
import { Outlet } from "react-router-dom";

const PublicLayout = () => {
  return (
    <>
      <Header />
      {/* Page Container 👇🏼 */}
      <div className="mt-[70px]">
        <Outlet />
      </div>
    </>
  );
};

export default PublicLayout;
