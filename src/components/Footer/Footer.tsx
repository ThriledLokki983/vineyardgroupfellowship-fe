import ViewTransitionLink from '../Layout/ViewTransitionLink'
import styles from './Footer.module.scss'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <p className={styles.text}>
          By using this website, you agree to our{' '}
          <ViewTransitionLink to="/privacy-policy" className={styles.link}>
            privacy policy
          </ViewTransitionLink>{' '}
          and{' '}
          <ViewTransitionLink to="/terms-of-use" className={styles.link}>
            terms of use
          </ViewTransitionLink>
          .
        </p>
        <p className={styles.copyright}>
          © {currentYear} Vineyard Group Fellowship. All rights reserved.
        </p>
      </div>
    </footer>
  )
}
