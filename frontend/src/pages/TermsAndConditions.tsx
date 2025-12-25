import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export default function TermsAndConditions() {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">{t('terms.title')}</h1>

        <div className="prose prose-sm max-w-none space-y-6 text-gray-700">
          <p className="text-sm text-gray-500">{t('terms.lastUpdated')}: December 25, 2024</p>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">{t('terms.section1.title')}</h2>
            <p>{t('terms.section1.content')}</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">{t('terms.section2.title')}</h2>
            <p>{t('terms.section2.content')}</p>
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li>{t('terms.section2.item1')}</li>
              <li>{t('terms.section2.item2')}</li>
              <li>{t('terms.section2.item3')}</li>
              <li>{t('terms.section2.item4')}</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">{t('terms.section3.title')}</h2>
            <p>{t('terms.section3.content')}</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">{t('terms.section4.title')}</h2>
            <p>{t('terms.section4.content')}</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">{t('terms.section5.title')}</h2>
            <p>{t('terms.section5.content')}</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">{t('terms.section6.title')}</h2>
            <p>{t('terms.section6.content')}</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">{t('terms.section7.title')}</h2>
            <p>{t('terms.section7.content')}</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">{t('terms.section8.title')}</h2>
            <p>{t('terms.section8.content')}</p>
          </section>
        </div>

        <div className="mt-8 pt-6 border-t border-gray-200">
          <Link to="/signup" className="btn btn-primary">
            {t('common.backToSignup')}
          </Link>
        </div>
      </div>
    </div>
  );
}
