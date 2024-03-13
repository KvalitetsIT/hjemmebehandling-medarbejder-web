import { PropsWithChildren } from "react";
import { LoadingSmallComponent } from "./LoadingSmallComponent";

export const Loading = (props: PropsWithChildren<{ isLoading?: boolean }>) => (
    <>
        
        {props.isLoading ? <LoadingSmallComponent/> : props.children}
    </>


)