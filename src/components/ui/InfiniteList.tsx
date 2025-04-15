"use client";

import clsx from "clsx";
import {useEffect, useRef, useState, useCallback} from "react";
import {AnimatePresence, motion} from "framer-motion";

const PAGE_SIZE = 10;

interface InfiniteListProps<T> {
  className?: string;
  items: T[];
  renderItem: (item: T, idx: number) => JSX.Element;
}

export const InfiniteList = <T,>({
  className,
  items,
  renderItem,
}: InfiniteListProps<T>) => {
  const [displayedItems, setDisplayedItems] = useState<T[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const pageRef = useRef(0);

  const loadMore = useCallback(async () => {
    if (loading || !hasMore) return;
    setLoading(true);

    const start = pageRef.current * PAGE_SIZE;
    const end = start + PAGE_SIZE;
    const pageItems = items.slice(start, end);

    setDisplayedItems((prev) => [...prev, ...pageItems]);
    pageRef.current += 1;
    setHasMore(end < items.length);
    setLoading(false);
  }, [items, loading, hasMore]);

  useEffect(() => {
    loadMore();
    // Trigger loadMore on initial render
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const observerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          loadMore();
        }
      },
      {threshold: 1.0}
    );

    if (observerRef.current) observer.observe(observerRef.current);
    return () => observer.disconnect();
  }, [loadMore]);

  return (
    <AnimatePresence mode="sync">
      <motion.div
        initial={{opacity: 0}}
        animate={{opacity: 1}}
        exit={{opacity: 0}}
        transition={{duration: 0.3}}
        className={clsx("flex flex-col gap-2 overflow-auto", className)}
      >
        {displayedItems.map((item, idx) => renderItem(item, idx))}
        {hasMore && (
          <div
            ref={observerRef}
            className="h-8 flex justify-center items-center"
          >
            {loading && "Loading..."}
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  );
};
