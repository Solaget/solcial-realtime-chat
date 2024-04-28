import { Link } from "react-router-dom";

const NavigateTo = ({ children, to }) => {
  return <Link to={to}>{children}</Link>;
};

export default NavigateTo;
