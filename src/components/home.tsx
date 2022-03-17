import { useHomePosts } from "api/posts";
import { useAmAdmin, useSite } from "api/site";
import { Button } from "atoms/input";
import { Column, Padding, Row } from "atoms/layout";
import { H1, H2, H3, InfoList, SecondaryInfo } from "atoms/typography";
import { SiteView } from "lemmy-js-client";
import router from "next/router";
import { useCallback } from "react";
import { RiShieldFill } from "react-icons/ri";
import { siteSettingsLink } from "util/link";
import { ChannelView } from "./community/channel_view";
import { ReadonlyEditor } from "./editor";

export function HomePage() {
  const infinitePosts = useHomePosts();
  const { site: siteResponse } = useSite();

  const amAdmin = useAmAdmin();

  const openSettingsPage = useCallback(
    () => router.push(siteSettingsLink()),
    [router]
  );

  if (!siteResponse) {
    // todo loading styling
    return null;
  }

  const aboutCard = (
    <Padding padding="16px">
      <Column gap="16px">
        <H1>All posts</H1>

        <Row>
          {amAdmin && (
            <Button onClick={openSettingsPage} icon={<RiShieldFill />}>
              Settings
            </Button>
          )}
        </Row>
      </Column>
    </Padding>
  );

  return (
    <ChannelView
      aboutCard={aboutCard}
      AboutContent={AboutSite}
      infinitePosts={infinitePosts}
    />
  );
}

function AboutSite() {
  const { site: siteResponse } = useSite();
  const { site, counts } = siteResponse.site_view;

  return (
    <Padding padding="16px">
      <H2>{site.name}</H2>
      <Column gap="16px">
        <Row>
          <SecondaryInfo>
            <InfoList>
              <div>{counts.users} users</div>
              <div>{counts.users_active_day} active today</div>
            </InfoList>
          </SecondaryInfo>
        </Row>
        <ReadonlyEditor markdown={site.description || ""} />
        <SiteStatistics siteView={siteResponse.site_view} />
      </Column>
    </Padding>
  );
}

function SiteStatistics({ siteView }: { siteView: SiteView }) {
  return (
    <div>
      <H3>Statistics</H3>
      <ul>
        <li>Created {siteView.site.published}</li>
        <li>{siteView.counts.users_active_month} active users this month</li>
        <li>{siteView.counts.posts} posts</li>
        <li>{siteView.counts.comments} comments</li>
      </ul>

      <style jsx>{`
        ul {
          margin: 0;
          padding: 0;
        }
        li {
          display: block;
        }
      `}</style>
    </div>
  );
}
