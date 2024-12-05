export type ReturnFunction = Promise<
  | {
      success: true;
    }
  | {
      success: false;
      error: string;
    }
>;
