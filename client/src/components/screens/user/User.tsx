import { useState } from "react";

import { format, formatDistanceToNow } from "date-fns";
import { useParams } from "react-router";

import { Loader } from "@/components/ui/loader/Loader.tsx";
import { useAuth } from "@/hooks/useAuth.ts";
import { useDocumentTitle } from "@/hooks/useDocumentTitle.ts";
import { useGetUser } from "@/hooks/users/useGetUser.ts";
import { exposureMap } from "@/shared/lists/exposure.map.ts";

import { ErrorPage } from "../error/ErrorPage.tsx";
import { NotFound } from "../not-found/NotFound.tsx";
import { LanguageItem } from "./components/language-item/LanguageItem.tsx";
import { ProfileInfo } from "./components/profile-info/ProfileInfo.tsx";
import { RecentPaste } from "./components/recent-paste/RecentPaste.tsx";
import { StatCard } from "./components/stat-card/StatCard.tsx";
import { UserEditPanel } from "./components/user-edit-panel/UserEditPanel.tsx";

import styles from "./User.module.scss";

type Props = {
  paramUserId: string;
};

export const User = () => {
  const { id: paramUserId } = useParams<"id">();

  if (!paramUserId || !paramUserId.trim().length) {
    return (
      <ErrorPage
        title="Failed to load user"
        description="The user is temporarily unavailable"
      />
    );
  }

  return <UserView paramUserId={paramUserId} />;
};

const UserView = ({ paramUserId }: Props) => {
  useDocumentTitle("User profile");

  const { isAuth, userId } = useAuth();
  const isMe = isAuth && userId === paramUserId;

  const { data, isLoading, error } = useGetUser(paramUserId);

  const [isEditing, setIsEditing] = useState(false);

  if (isLoading) {
    return (
      <main>
        <Loader isVisible label="Loading paste..." />
      </main>
    );
  }

  if (error) {
    if (error.message === "User not found") {
      return (
        <NotFound
          title="User not found"
          description="The user you are looking for does not exist"
        />
      );
    } else if (error.message === "User is private") {
      return (
        <ErrorPage
          code="403"
          title="User is private"
          description="This user's profile is private"
        />
      );
    } else {
      return (
        <ErrorPage
          title="Failed to load user's page"
          description="This page is temporarily unavailable"
        />
      );
    }
  }

  if (!data) {
    return (
      <ErrorPage
        title="Failed to load user"
        description="The user is temporarily unavailable"
      />
    );
  }

  return (
    <main className={styles.screen}>
      <section className={styles.container} aria-labelledby="profile-title">
        {isEditing ? (
          <UserEditPanel
            data={data}
            isMe={isMe}
            paramUserId={paramUserId}
            setIsEditing={setIsEditing}
          />
        ) : (
          <ProfileInfo data={data} isMe={isMe} setIsEditing={setIsEditing} />
        )}

        <section className={styles.stats} aria-label="Profile statistics">
          {data.statistics.map((stat) => (
            <StatCard key={stat.label} label={stat.label} value={stat.value} />
          ))}
        </section>

        <div className={styles.contentGrid}>
          <section className={styles.panel} aria-labelledby="recent-title">
            <div className={styles.panelHeader}>
              <div>
                <p className={styles.panelEyebrow}>Workspace</p>
                <h2 id="recent-title" className={styles.panelTitle}>
                  Recent pastes
                </h2>
              </div>
              <a className={styles.panelLink} href="/">
                View all
              </a>
            </div>

            <div className={styles.pasteList}>
              {data.pastes.map((paste) => (
                <RecentPaste
                  key={paste.id}
                  id={paste.id}
                  title={paste.title}
                  description={paste.description}
                  language={paste.language}
                  updatedAt={paste.updatedAt}
                  exposure={paste.exposure}
                />
              ))}
            </div>
          </section>

          <aside className={styles.sidebar} aria-label="Account summary">
            <section className={styles.panel}>
              <p className={styles.panelEyebrow}>Account</p>
              <h2 className={styles.panelTitle}>Details</h2>

              <dl className={styles.details}>
                {isMe && (
                  <>
                    <div className={styles.detailRow}>
                      <dt>Email</dt>
                      <dd>{data.email}</dd>
                    </div>
                    <div className={styles.detailRow}>
                      <dt>Default exposure</dt>
                      <dd>
                        {data.exposure ? exposureMap[data.exposure] : "Private"}
                      </dd>
                    </div>
                  </>
                )}

                <div className={styles.detailRow}>
                  <dt>Joined</dt>
                  <dd>{format(new Date(data.createdAt), "MMMM d, yyyy")}</dd>
                </div>
                <div className={styles.detailRow}>
                  <dt>Last active</dt>
                  <dd>
                    {formatDistanceToNow(new Date(data.lastActiveAt), {
                      includeSeconds: true,
                      addSuffix: true,
                    })}
                  </dd>
                </div>
              </dl>
            </section>

            <section className={styles.panel}>
              <p className={styles.panelEyebrow}>Languages</p>
              <h2 className={styles.panelTitle}>Top usage</h2>

              <ul className={styles.languageList}>
                {data.mostUsedLanguages.map((language) => (
                  <LanguageItem
                    key={language.language}
                    language={language.language}
                    count={language.count}
                  />
                ))}
              </ul>
            </section>
          </aside>
        </div>
      </section>
    </main>
  );
};
