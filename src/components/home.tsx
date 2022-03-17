import { useHomePosts } from "api/posts";
import { useSite } from "api/site";
import { Padding, Column, Row } from "atoms/layout";
import { H2, SecondaryInfo, InfoList, H3, H1 } from "atoms/typography";
import { SiteView } from "lemmy-js-client";
import { CommunityThumbnail, AboutCommunity } from "./community/about";
import { CommunityBadge } from "./community/badge";
import { ChannelView } from "./community/channel_view";
import { CommunityPage } from "./community/community";
import { ReadonlyEditor } from "./editor";

export function HomePage() {
  const infinitePosts = useHomePosts();
  const { site: siteResponse } = useSite();

  if (!siteResponse) {
    // todo loading styling
    return null;
  }

  const aboutCard = (
    <Padding>
      <H1>All posts</H1>
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
