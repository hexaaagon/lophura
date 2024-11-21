export type ServiceData<T> =
  | {
      success: false;
      error: {
        code: string;
        message: string;
      };
    }
  | {
      success: true;
      data: T;
    };
