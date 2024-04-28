import { SpinnerLoader } from "../ui/loader";
const PageLoader = () => (
  <div className="w-full h-screen grid place-content-center">
    <div className="flex flex-col items-center gap-2">
      <SpinnerLoader />
      <h3 className="text-lg">Loading...</h3>
    </div>
  </div>
);

export default PageLoader;
