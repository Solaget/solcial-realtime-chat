// Lib 👇🏼
import { Outlet } from "react-router-dom";
// Sidebar for layout 👇🏼
import Aside from "@/components/main/aside";

const MainLayout = () => {
  return (
    <div className="flex w-full min-h-screen">
      <Aside />
      {/* Page Container 👇🏼 */}
      <div className="flex-1 rounded-r-none bg-light-secondary dark:bg-dark-secondary">
        <Outlet />
      </div>
    </div>
  );
};

export default MainLayout;
