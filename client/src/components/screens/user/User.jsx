import { useDispatch } from "react-redux";
import { useParams } from "react-router";

import { useAuth } from "@/hooks/useAuth.js";
import { useDocumentTitle } from "@/hooks/useDocumentTitle.js";
import { addNotification } from "@/store/notification/notificationSlice.js";

import styles from "./User.module.scss";

export const User = () => {
  useDocumentTitle("User profile");

  const params = useParams();
  const paramUserId = params.id;

  const { isAuth, userId } = useAuth();
  const dispatch = useDispatch();

  const isMe = isAuth && userId === paramUserId;

  return (
    <main className={styles.screen}>
      <section className={styles.container} aria-labelledby="profile-title">
        <section className={styles.profile}>
          <div className={styles.identity}>
            <div className={styles.avatar} aria-hidden="true">
              KP
            </div>
            <div>
              <p className={styles.eyebrow}>Profile</p>
              <h1 id="profile-title" className={styles.title}>
                Konstantin Panfilov
              </h1>
              <p className={styles.subtitle}>
                Full-stack engineer building a focused workspace for code
                snippets, notes, and reusable paste references.
              </p>
              <div className={styles.profileMeta} aria-label="Profile metadata">
                <span>Junior full-stack developer</span>
                <span>JavaScript / React / Node.js</span>
                <span>Europe/Moscow</span>
              </div>
            </div>
          </div>

          <div className={styles.profileActions} aria-label="Profile actions">
            {isMe && (
              <button className={styles.secondaryAction} type="button" disabled>
                Edit profile
              </button>
            )}
          </div>
        </section>

        <section className={styles.stats} aria-label="Profile statistics">
          <article className={styles.statCard}>
            <span className={styles.statValue}>128</span>
            <span className={styles.statLabel}>Total pastes</span>
            <span className={styles.statHint}>+12 this month</span>
          </article>
          <article className={styles.statCard}>
            <span className={styles.statValue}>84</span>
            <span className={styles.statLabel}>Public</span>
            <span className={styles.statHint}>65% of workspace</span>
          </article>
          <article className={styles.statCard}>
            <span className={styles.statValue}>37</span>
            <span className={styles.statLabel}>Private</span>
            <span className={styles.statHint}>Protected notes</span>
          </article>
          <article className={styles.statCard}>
            <span className={styles.statValue}>2.4k</span>
            <span className={styles.statLabel}>Views</span>
            <span className={styles.statHint}>Across public pastes</span>
          </article>
          <article className={styles.statCard}>
            <span className={styles.statValue}>312</span>
            <span className={styles.statLabel}>Likes</span>
            <span className={styles.statHint}>From community</span>
          </article>
          <article className={styles.statCard}>
            <span className={styles.statValue}>19</span>
            <span className={styles.statLabel}>Comments</span>
            <span className={styles.statHint}>Open discussions</span>
          </article>
          <article className={styles.statCard}>
            <span className={styles.statValue}>11</span>
            <span className={styles.statLabel}>Languages</span>
            <span className={styles.statHint}>Most used: JavaScript</span>
          </article>
          <article className={styles.statCard}>
            <span className={styles.statValue}>4</span>
            <span className={styles.statLabel}>Collections</span>
            <span className={styles.statHint}>Grouped references</span>
          </article>
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
              <article className={styles.pasteItem}>
                <div>
                  <h3 className={styles.pasteTitle}>auth-refresh-flow.js</h3>
                  <p className={styles.pasteMeta}>
                    JavaScript / updated 12 minutes ago
                  </p>
                  <p className={styles.pasteDescription}>
                    Refresh token flow notes with retry boundaries and client
                    logout handling.
                  </p>
                </div>
                <span className={styles.badge}>Public</span>
              </article>

              <article className={styles.pasteItem}>
                <div>
                  <h3 className={styles.pasteTitle}>
                    postgres-index-notes.sql
                  </h3>
                  <p className={styles.pasteMeta}>SQL / updated yesterday</p>
                  <p className={styles.pasteDescription}>
                    Index checklist for paste search, user lookup, and recent
                    feed sorting.
                  </p>
                </div>
                <span className={styles.badge}>Private</span>
              </article>

              <article className={styles.pasteItem}>
                <div>
                  <h3 className={styles.pasteTitle}>react-query-cache.md</h3>
                  <p className={styles.pasteMeta}>
                    Markdown / updated 3 days ago
                  </p>
                  <p className={styles.pasteDescription}>
                    Query key rules, cache invalidation notes, and stale state
                    examples.
                  </p>
                </div>
                <span className={styles.badge}>Unlisted</span>
              </article>
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
                      <dd>konstantin@example.com</dd>
                    </div>
                    <div className={styles.detailRow}>
                      <dt>Plan</dt>
                      <dd>Free workspace</dd>
                    </div>
                    <div className={styles.detailRow}>
                      <dt>Default exposure</dt>
                      <dd>Public</dd>
                    </div>
                  </>
                )}

                <div className={styles.detailRow}>
                  <dt>Joined</dt>
                  <dd>March 2026</dd>
                </div>
                <div className={styles.detailRow}>
                  <dt>Last active</dt>
                  <dd>Today at 14:32</dd>
                </div>
              </dl>
            </section>

            <section hidden className={styles.panel}>
              <p className={styles.panelEyebrow}>Usage</p>
              <h2 className={styles.panelTitle}>Storage</h2>

              <div className={styles.usage}>
                <div className={styles.usageHeader}>
                  <span>6.8 MB used</span>
                  <span>25 MB</span>
                </div>
                <div className={styles.usageTrack} aria-hidden="true">
                  <span className={styles.usageValue} />
                </div>
              </div>
            </section>

            <section className={styles.panel}>
              <p className={styles.panelEyebrow}>Languages</p>
              <h2 className={styles.panelTitle}>Top usage</h2>

              <ul className={styles.languageList}>
                <li>
                  <span>JavaScript</span>
                  <strong>46 pastes</strong>
                </li>
                <li>
                  <span>Markdown</span>
                  <strong>29 pastes</strong>
                </li>
                <li>
                  <span>SQL</span>
                  <strong>18 pastes</strong>
                </li>
              </ul>
            </section>
          </aside>
        </div>
      </section>
    </main>
  );
};
