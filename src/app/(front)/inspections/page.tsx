import isTeacher from "@/hocs/isAuthorized";

const Page = () => {
  return (
    <div>
      <p>Zde bude seznam všech aktuálních praxí všech studentů.</p>
    </div>
  );
};

export default isTeacher(Page);
