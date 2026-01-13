import React, { useState } from "react";
import { Image, useWindowDimensions } from "react-native";

const defaultSpiderImage = require("@/assets/images/spider.png");

type Props = {
  size?: number;
  imageUri?: string | null;
};

const SpiderImage = ({ size, imageUri }: Props) => {
  const { width } = useWindowDimensions();
  const imageSize = size || Math.min(width / 1.5, 400);
  const [hasError, setHasError] = useState(false);

  const shouldUseDefault = !imageUri || imageUri.trim() === "" || hasError;

  return (
    <Image
      source={shouldUseDefault ? defaultSpiderImage : { uri: imageUri }}
      style={{
        width: imageSize,
        height: imageSize,
        borderRadius: 6,
      }}
      resizeMode="contain"
      onError={() => setHasError(true)}
    />
  );
};

export default SpiderImage;
