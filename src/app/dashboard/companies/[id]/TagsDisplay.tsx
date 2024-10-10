"use client"
import CompaniesTags from "@/components/CompaniesTags/CompaniesTags";

const TagDisplay = ({ id }: { id: number }) => {
  return (
    <>
      <CompaniesTags companyId={id} editable={true} />
    </>
  );
};

export default TagDisplay;
