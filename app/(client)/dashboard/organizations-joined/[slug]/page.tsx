import { Metadata } from "next";

import OrganizationJoined from "./_components/organization-joined";

import { generatePageMetadata } from "@/lib/utils/page-metadata";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata(props: PageProps): Promise<Metadata> {
  const { slug } = await props.params;

  return generatePageMetadata({
    title: "My Earnings",
    description: `View your salary streams and earnings from organization ${slug}.`,
    keywords: ["earnings", "salary", "streams", "yield", "employee"],
  });
}
const Page = async (props: PageProps) => {
  const { slug: id } = await props.params;

  return <OrganizationJoined id={id} />;
};

export default Page;
