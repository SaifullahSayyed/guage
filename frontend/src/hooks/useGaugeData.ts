import { useState, useEffect } from 'react';
import { useGaugeStore } from '../store/gaugeStore';

export function useGaugeData() {
  const {
    jobTitle, skillData, isLoading, error,
    fetchSkillData, usingFallback,
  } = useGaugeStore();

  const [hasSearched, setHasSearched] = useState(false);

  const search = async (title?: string) => {
    if (title) useGaugeStore.getState().setJobTitle(title);
    setHasSearched(true);
    await fetchSkillData();
  };

  return { jobTitle, skillData, isLoading, error, hasSearched, search, usingFallback };
}
