declare namespace Main {
  type State = {
    error: string | null;
    data: Record<string, string[][]>;
  };

  type StateActions = {
    setError: (error: string) => void;
    clearError: () => void;
    setData: (data: State['data']) => void;
  };
}
