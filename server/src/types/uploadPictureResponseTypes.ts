export interface UploadPictureResponse {
  secureUrl: string;
  publicId: string;
}

export type FalResponseImage = {
  content_type: string;
  height: number;
  url: string;
  width: number;
};

export type FalResponseTypes = {
  has_nsfw_concepts: boolean[];
  images: FalResponseImage[];
  seed: number;
  timings: {
    inference: number;
  };
};

export type FalResponseTypes2 = {
  image: {
    height: number;
    content_type: string;
    url: string;
    width: number;
  };
};
