import { Card } from "atoms/card";
import { Padding } from "atoms/layout";
import { H1 } from "atoms/typography";
import { ReadonlyEditor } from "components/editor";

export function FullPost({ postView, isLoading }) {
  if (isLoading || !postView) {
    // todo better loading state
    return null;
  }

  console.log({ isLoading, post: postView });

  return (
    <Card>
      <Padding>
        <H1>{postView.post.name}</H1>
        <ReadonlyEditor markdown={postView.post.body} />
      </Padding>
    </Card>
  );
}
