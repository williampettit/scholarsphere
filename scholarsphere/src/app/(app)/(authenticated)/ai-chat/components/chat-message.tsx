import { siteConfig } from "@/config/site-config";
import { Message } from "ai/react";
import dayjs from "dayjs";
import {
  AtomIcon,
  CogIcon,
  FunctionSquareIcon,
  type LucideIcon,
  UserIcon,
} from "lucide-react";
import remarkGfm from "remark-gfm";

import {
  type ReactMarkdownComponentMap as MarkdownComponentMap,
  MemoizedReactMarkdown,
} from "@/components/markdown";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export type ChatMessageRole = Message["role"];

type ChatMessageProps = {
  role: ChatMessageRole;
  content: string;
  index: number;
  createdAt?: Date;
};

type RoleMap = {
  [key in ChatMessageRole]: {
    label: string;
    style: string;
    icon: LucideIcon;
  };
};

const ROLE_MAP: RoleMap = {
  user: {
    label: "User",
    style: "text-yellow-500",
    icon: UserIcon,
  },
  system: {
    label: "System",
    style: "text-red-500",
    icon: CogIcon,
  },
  function: {
    label: "Function",
    style: "text-cyan-500",
    icon: FunctionSquareIcon,
  },
  assistant: {
    label: `${siteConfig.name} AI Assistant`,
    style: "text-green-500",
    icon: AtomIcon,
  },
};

const markdownComponentMap: MarkdownComponentMap = {
  p({ children }) {
    return <p className="mb-2 last:mb-0">{children}</p>;
  },
  a({ children, ...props }) {
    return (
      <a className="underline" target="_blank" {...props}>
        {children}
      </a>
    );
  },
  ul({ children }) {
    return <ul className="ml-4 list-disc">{children}</ul>;
  },
  ol({ children }) {
    return <ol className="ml-4 list-disc">{children}</ol>;
  },
  h1({ children }) {
    return <h1 className="mb-2 text-lg">{children}</h1>;
  },
  h2({ children }) {
    return <h2 className="mb-2 text-lg">{children}</h2>;
  },
  h3({ children }) {
    return <h3 className="text-md mb-2">{children}</h3>;
  },
  h4({ children }) {
    return <h4 className="text-md mb-2">{children}</h4>;
  },
  h5({ children }) {
    return <h5 className="mb-2 text-sm">{children}</h5>;
  },
  h6({ children }) {
    return <h6 className="mb-2 text-sm">{children}</h6>;
  },
  li({ children }) {
    return <li className="mb-1">{children}</li>;
  },
  table({ children }) {
    return <Table>{children}</Table>;
  },
  thead({ children }) {
    return <TableHeader>{children}</TableHeader>;
  },
  tbody({ children }) {
    return <TableBody>{children}</TableBody>;
  },
  tr({ children }) {
    return <TableRow>{children}</TableRow>;
  },
  th({ children }) {
    return <TableHead className="px-2 py-1 text-left">{children}</TableHead>;
  },
  td({ children }) {
    return <TableCell className="px-2 py-1 text-left">{children}</TableCell>;
  },
  caption({ children }) {
    return <TableCaption className="text-center">{children}</TableCaption>;
  },
};

export function ChatMessage({
  content,
  role,
  index,
  createdAt,
}: ChatMessageProps) {
  const { label: roleLabel, style: roleStyle, icon: RoleIcon } = ROLE_MAP[role];

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row justify-between">
          <div className="flex flex-row gap-2">
            <RoleIcon className={roleStyle} />

            <span className="text-md font-semibold">{roleLabel}</span>
          </div>

          <Badge className="flex flex-row gap-2 space-x-2">
            {createdAt ? (
              <>
                {dayjs(createdAt).fromNow()}

                <Separator orientation="vertical" />
              </>
            ) : null}

            {`#${index}`}
          </Badge>
        </CardHeader>

        <CardContent>
          <MemoizedReactMarkdown
            remarkPlugins={[remarkGfm]}
            className="prose dark:prose-invert prose-p:leading-relaxed prose-pre:p-0 break-words"
            components={markdownComponentMap}
          >
            {content}
          </MemoizedReactMarkdown>
        </CardContent>
      </Card>
    </>
  );
}
