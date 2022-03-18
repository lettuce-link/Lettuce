import { RevealButton } from "atoms/input";
import { Column, Row } from "atoms/layout";
import { useCallback, useEffect, useState } from "react";
import { RiArrowUpSLine, RiArrowDownSLine } from "react-icons/ri";

/**
 * A column of upvote-score-downvote
 *
 * Props:
 * upvotes: upvote count
 * downvotes: downvote count
 * myVote: my current vote
 * setMyVote: set my current vote
 */
export const VerticalVote = makeVoteWidgetComponent(({ children }) => {
  return (
    <Column gap="2px" align="center">
      {children}
    </Column>
  );
});

/**
 * A row of upvote-score-downvote
 *
 * Props:
 * upvotes: upvote count
 * downvotes: downvote count
 * myVote: my current vote
 * setMyVote: set my current vote
 */
export const HorizontalVote = makeVoteWidgetComponent(({ children }) => {
  return (
    <Row gap="4px" align="center">
      {children}
    </Row>
  );
});

/**
 * A higher-order-component
 * This allows us to be generic over the button layout
 */
function makeVoteWidgetComponent(Layout) {
  return ({ upvotes, downvotes, myVote, setMyVote }) => {
    const [optimisticMyVote, setOptimistic] = useState(myVote);

    useEffect(() => {
      setOptimistic(myVote);
    }, [myVote]);

    // Untill the server says otherwise, assume that all vote operations succeed
    const optimisticScore = upvotes - downvotes + (optimisticMyVote - myVote);

    // todo: error handling!

    const upvote = useCallback(() => {
      const newVote = optimisticMyVote == 1 ? 0 : 1;
      setMyVote(newVote);
      setOptimistic(newVote);
    }, [optimisticMyVote, setMyVote]);

    const downvote = useCallback(() => {
      const newVote = optimisticMyVote == -1 ? 0 : -1;
      setMyVote(newVote);
      setOptimistic(newVote);
    }, [optimisticMyVote, setMyVote]);

    return (
      <Layout>
        <UpDoot onClick={upvote} selected={optimisticMyVote == 1} />
        <Score>{optimisticScore}</Score>
        <DownDoot onClick={downvote} selected={optimisticMyVote == -1} />
      </Layout>
    );
  };
}

function Score({ children }) {
  // todo: details on hover (up, down)

  return (
    <span className="Score">
      {children}
      <style jsx>{`
        .Score {
          line-height: 1;

          min-width: 16px;
          text-align: center;
        }
      `}</style>
    </span>
  );
}

const UpDoot = makeVoteButtonComponent(RiArrowUpSLine);

const DownDoot = makeVoteButtonComponent(RiArrowDownSLine);

function makeVoteButtonComponent(Icon) {
  return ({ onClick, selected }) => {
    const color = selected
      ? "var(--color-success-strong)"
      : "var(--foreground-strong)";
    return (
      <RevealButton onClick={onClick}>
        <span>
          <Icon />
        </span>

        <style jsx>{`
          span {
            display: flex;
            color: ${color};

            transition: color var(--transition-quick);
          }
        `}</style>
      </RevealButton>
    );
  };
}
