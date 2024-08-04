import isTeacher from "@/hocs/isAuthorized";
import InternshipsTable from "./InternshipsTable";

const Page = () => {
  return (
    <div>
      <InternshipsTable />
    </div>
  );
};

export default isTeacher(Page);
