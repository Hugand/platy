import Skeleton from "react-loading-skeleton";

export const ChatLoadingSkeleton = () => {
  return (
    <>
      <Skeleton height={30} width={200} style={{ marginTop: 8, marginBottom: 8 }} />
      <Skeleton height={30} width={120} style={{ marginTop: 8, marginBottom: 8 }}/>
      <Skeleton height={30} width={190} style={{ marginTop: 8, marginBottom: 8, float: 'right' }}/>
      <Skeleton height={30} width={100} style={{ marginTop: 8, marginBottom: 8, float: 'right' }}/>
      <Skeleton height={30} width={170} style={{ marginTop: 8, marginBottom: 8 }}/>
      <Skeleton height={30} width={160} style={{ marginTop: 8, marginBottom: 8 }}/>
      <Skeleton height={30} width={130} style={{ marginTop: 8, marginBottom: 8, float: 'right' }}/>
      <Skeleton height={30} width={80} style={{ marginTop: 8, marginBottom: 8, float: 'right' }}/>
      <Skeleton height={30} width={100} style={{ marginTop: 8, marginBottom: 8, float: 'right' }}/>
      <Skeleton height={30} width={120} style={{ marginTop: 8, marginBottom: 8 }} />
    </>);
};
