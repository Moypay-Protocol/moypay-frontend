import { Metadata } from "next";

import Organization from "./_components/organization";

import { generatePageMetadata } from "@/lib/utils/page-metadata";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata(props: PageProps): Promise<Metadata> {
  const { slug } = await props.params;

  return generatePageMetadata({
    title: "My Organization",
    description: `Manage organization ${slug} employees, payroll, and settings.`,
    keywords: ["organization", "management", "employees", "payroll"],
  });
}

const Page = async (props: PageProps) => {
  const { slug: id } = await props.params;

  return <Organization id={id} />;
};

export default Page;
