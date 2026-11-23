import { useEffect, useState } from "react";
import axiosInstance from "./api";
import { Attachment } from "./types";

// attachments are served from an authenticated endpoint (so tag-based post
// visibility still applies to them), which a plain <img src> can't hit since
// it can't carry an Authorization header - so fetch the bytes ourselves and
// hand back a local object URL instead.
export function useAttachmentBlobUrl(attachment: Attachment | null | undefined) {
  const [url, setUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!attachment?.url) {
      setUrl(null);
      return;
    }
    let cancelled = false;
    let objectUrl: string | null = null;

    axiosInstance
      .get(attachment.url, { responseType: "blob" })
      .then((res) => {
        if (cancelled) return;
        objectUrl = URL.createObjectURL(res.data);
        setUrl(objectUrl);
      })
      .catch(() => {
        if (!cancelled) setUrl(null);
      });

    return () => {
      cancelled = true;
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [attachment?.url]);

  return url;
}
