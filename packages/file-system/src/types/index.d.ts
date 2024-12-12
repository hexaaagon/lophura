export type FunctionReturn<T = any> = Promise<
  | {
      success: true;
      data?: T;
    }
  | {
      success: false;
      error: string;
    }
>;
