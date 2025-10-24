"use client";

import React, { useState, useEffect } from "react";
import { useAccount } from "wagmi";
import { ArrowUpRight, Building2, Users } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

import OrganizationCreator from "./dialog/organization-creator";

import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useOrganizationListsByOwner } from "@/hooks/query/graphql/use-organization-lists-by-owner";
import { Button } from "@/components/ui/button";
import { useOrganizationJoinedListsByEmployee } from "@/hooks/query/graphql/use-organization-joined-lists-by-employee";

const OrganizationCardSkeleton = () => (
  <div className="p-3 border-2 border-muted rounded-xl flex gap-2 items-center min-w-[140px]">
    <div className="flex flex-col items-center gap-2 w-full">
      <Skeleton className="w-20 h-20 rounded-lg" />
      <Skeleton className="w-full h-10 rounded-md" />
    </div>
  </div>
);

const EmptyState = ({
  icon: Icon,
  title,
  description,
}: {
  icon: React.ComponentType<any>;
  title: string;
  description: string;
}) => (
  <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
    <div className="w-16 h-16 border-1 border-muted-foreground rounded-full flex items-center justify-center mb-4">
      <Icon className="w-8 h-8 text-muted-foreground" />
    </div>
    <h3 className="text-lg font-semibold mb-2">{title}</h3>
    <p className="text-muted-foreground mb-6 max-w-md">{description}</p>
  </div>
);

export default function Dashboard() {
  const { isConnected } = useAccount();
  const [isMounted, setIsMounted] = useState(false);
  const {
    data: organizationLists,
    isLoading: isOwnedLoading,
    refetch,
  } = useOrganizationListsByOwner();
  const { data: organizationJoinedLists, isLoading: isJoinedLoading } =
    useOrganizationJoinedListsByEmployee();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return (
      <div className="w-full h-full max-w-7xl mx-auto flex items-center justify-center 2xl:p-10">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <Skeleton className="h-8 w-32 mx-auto mb-2" />
            <Skeleton className="h-4 w-48 mx-auto" />
          </CardHeader>
        </Card>
      </div>
    );
  }

  if (!isConnected) {
    return (
      <div className="w-full h-full max-w-7xl mx-auto flex items-center justify-center 2xl:p-10">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle>Connect Your Wallet</CardTitle>
            <CardDescription>
              Please connect your wallet to access the MoyPay dashboard
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="w-full h-auto max-w-7xl mx-auto px-4 py-6 2xl:p-10">
      <div className="flex flex-col gap-6 p-2">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
              Dashboard
            </h1>
            <p className="text-muted-foreground">
              Manage your organizations and payroll systems
            </p>
          </div>
        </div>

        <Separator />

        <Card className="pb-10">
          <CardHeader className="p-0 pt-5 px-5">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div className="flex flex-col items-start gap-2">
                <CardTitle>Your Organizations</CardTitle>
                <CardDescription>
                  Select an organization to manage its payroll and settings
                </CardDescription>
              </div>
              <OrganizationCreator
                onSuccess={() => {
                  refetch();
                }}
              />
            </div>
          </CardHeader>
          <CardContent>
            {isOwnedLoading ? (
              <div className="flex flex-wrap gap-4">
                {Array.from({ length: 3 }).map((_, index) => (
                  <OrganizationCardSkeleton key={index} />
                ))}
              </div>
            ) : organizationLists?.length > 0 ? (
              <div className="flex flex-wrap gap-4">
                {organizationLists.map((org, index) => (
                  <Link
                    key={index}
                    className="p-3 border-2 border-b-muted-foreground hover:border-primary transition-all duration-200 rounded-xl flex gap-2 items-center min-w-[140px]"
                    href={`/dashboard/organizations/${org.id}`}
                  >
                    <div className="flex flex-col items-center gap-2 w-full">
                      <Image
                        alt={`${org.createdAt} logo`}
                        className="w-20 h-20"
                        height={144}
                        src={`/images/abstract/${(Number(org?.createdAt ?? 0) % 35) + 1}.jpg`}
                        width={144}
                      />
                      <Button
                        className="w-full flex items-center gap-2"
                        variant="default"
                      >
                        <span className="truncate">{org.name}</span>
                        <ArrowUpRight className="w-5 h-5" />
                      </Button>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <EmptyState
                description="You haven't created any organizations yet. Create your first organization to start managing payroll and team members."
                icon={Building2}
                title="No Organizations Yet"
              />
            )}
          </CardContent>
        </Card>

        <Card className="pb-10">
          <CardHeader className="p-0 pt-5 px-5">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div className="flex flex-col items-start gap-2">
                <CardTitle>Organizations Joined & Automated Earn</CardTitle>
                <CardDescription>
                  View organizations you have joined and manage your automated
                  earnings
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {isJoinedLoading ? (
              <div className="flex flex-wrap gap-4">
                {Array.from({ length: 2 }).map((_, index) => (
                  <OrganizationCardSkeleton key={index} />
                ))}
              </div>
            ) : organizationJoinedLists?.length > 0 ? (
              <div className="flex flex-wrap gap-4">
                {organizationJoinedLists.map((org, index) => (
                  <Link
                    key={index}
                    className="p-3 border-2 border-b-muted-foreground hover:border-primary transition-all duration-200 rounded-xl flex gap-2 items-center min-w-[140px]"
                    href={`/dashboard/organizations-joined/${org.id}`}
                  >
                    <div className="flex flex-col items-center gap-2 w-full">
                      <Image
                        alt={`${org.createdAt} logo`}
                        className="w-20 h-20"
                        height={144}
                        src={`/images/abstract/${(Number(org.createdAt) % 35) + 1}.jpg`}
                        width={144}
                      />
                      <Button
                        className="w-full flex items-center gap-2"
                        variant="default"
                      >
                        <span className="truncate">{org.name}</span>
                        <ArrowUpRight className="w-5 h-5" />
                      </Button>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <EmptyState
                description="You haven't joined any organizations yet. Wait for an invitation from an organization owner to join their team."
                icon={Users}
                title="No Organizations Joined"
              />
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
