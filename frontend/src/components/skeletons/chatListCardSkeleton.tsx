import Skeleton from "react-loading-skeleton";

export const ChatListCardSkeleton = () => {
  return (
    <>
      <Skeleton width={80} height={80} circle={true} style={{ marginTop: 8, marginBottom: 8, float: 'right' }} />
      <article>
          <h4><Skeleton width={'100%'} height={30}/></h4>
          <p><Skeleton width={'60%'} height={16}/></p>
      </article>
    </>);
};
