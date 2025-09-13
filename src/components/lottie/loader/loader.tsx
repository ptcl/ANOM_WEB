import React from 'react'
import Lottie from "lottie-react";
import loaderAnimation from './protocolLoading.json'

interface LoaderProps {
    width?: number | string;
    height?: number | string;
}
export default function Loader({ width, height }: LoaderProps) {
    return (
        <Lottie loop autoplay animationData={loaderAnimation} style={{ width, height }} />
    )
}
