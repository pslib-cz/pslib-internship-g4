import isAuthorized from "@/hocs/isAuthorized";

const Page = () => {
  return (
    <div>
      <p>Zde bude seznam praxí daného uživatele</p>
    </div>
  );
};

export default isAuthorized(Page);
