import isAdmin from "@/hocs/isAdmin";

const DashboardLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <>
      <h1>Administrace</h1>
      {children}
    </>
  );
};

export default isAdmin(DashboardLayout);
