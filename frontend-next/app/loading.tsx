import Container from "./components/ui/container";
import {Skeleton} from "./components/ui/skeleton";

const Loading = () => {
  return (
    <Container>
      <div className="w-full h-full space-y-10 pb-10">
        <div className="flex flex-col gap-y-8 px-4 sm:px-6 lg:px-8">
          <div className="">
            <Skeleton className="aspect-square rounded-xl max-w-2xl"/>
          </div>
              <Skeleton className="aspect-square rounded-xl max-w-2xl"/>
              <Skeleton className="aspect-square rounded-xl max-w-2xl"/>
              <Skeleton className="aspect-square rounded-xl max-w-2xl"/>
              <Skeleton className="aspect-square rounded-xl max-w-2xl"/>
              <Skeleton className="aspect-square rounded-xl max-w-2xl"/>
        </div>
      </div>
    </Container>
  );
}

export default Loading;