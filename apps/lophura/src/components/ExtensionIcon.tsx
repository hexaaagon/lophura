import { Film, Image, File } from "lucide-react";
import { ComponentProps } from "react";

export function ExtensionIcon({
  ext,
  ...props
}: ComponentProps<"svg"> & { ext: string }): JSX.Element {
  let icon: JSX.Element;

  switch (ext) {
    case "mp4":
    case "webm":
    case "mkv":
      icon = <Film {...props} />;
      break;
    case "jpg":
    case "png":
    case "jpeg":
      icon = <Image {...props} />;
      break;
    default:
      icon = <File {...props} />;
  }

  return icon;
}
