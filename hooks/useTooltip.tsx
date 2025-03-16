import { useState, useEffect, useCallback } from "react";

export const useTooltip = (timeout: number = 3000) => {
  const [visible, setVisible] = useState(false);

  const showTooltip = useCallback(() => {
    setVisible(true);
    setTimeout(() => setVisible(false), timeout);
  }, [timeout]);

  return { visible, showTooltip };
};
