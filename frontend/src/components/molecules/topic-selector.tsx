"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { motion } from "framer-motion";

const topicVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

interface TopicSelectorProps {
  topic: string;
  isSelected: boolean;
  onTopicChange: (topic: string) => void;
}

export function TopicSelector({
  topic,
  isSelected,
  onTopicChange,
}: TopicSelectorProps) {
  const id = `topic-${topic}`;
  return (
    <motion.div
      variants={topicVariants}
      className="flex items-center space-x-3 p-3 bg-card rounded-lg border border-border hover:border-accent/70 transition-colors cursor-pointer"
      // onClick={() => onTopicChange(topic)}
    >
      <Checkbox
        id={id}
        checked={isSelected}
        onCheckedChange={() => onTopicChange(topic)}
        className="h-5 w-5 border-muted-foreground data-[state=checked]:bg-accent data-[state=checked]:border-accent transition-all"
      />
      <label
        htmlFor={id}
        className="font-medium text-foreground leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 capitalize cursor-pointer flex-1"
      >
        {topic.replace("-", " ")}
      </label>
    </motion.div>
  );
}
