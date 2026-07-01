import { Button } from "@/components/ui/button/Button.jsx";
import type { User } from "@/types/user.types.ts";

import styles from "./ProfileInfo.module.scss";

type Props = {
  data: User;
  isMe: boolean;
  setIsEditing: (isEditing: boolean) => void;
};

export const ProfileInfo = ({ data, isMe, setIsEditing }: Props) => {
  return (
    <section className={styles.profile}>
      <div className={styles.identity}>
        <div className={styles.avatar} aria-hidden="true">
          {data.username[0].toUpperCase()}
        </div>
        <div>
          <p className={styles.eyebrow}>Profile</p>
          <h1 id="profile-title" className={styles.title}>
            {data.username}
          </h1>
          <p className={styles.subtitle}>
            {data.description ? data.description : "No description"}
          </p>
        </div>
      </div>

      <div className={styles.profileActions} aria-label="Profile actions">
        {isMe && (
          <Button
            variant="primary"
            className={styles.primaryAction}
            onClick={() => {
              setIsEditing(true);
            }}
          >
            Edit profile
          </Button>
        )}
      </div>
    </section>
  );
};
