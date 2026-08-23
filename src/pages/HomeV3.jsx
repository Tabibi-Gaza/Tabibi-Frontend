import React, { Suspense, lazy } from "react";
import { useTranslation } from "react-i18next";
import FramesSection from "../components/v3/FramesSection";
import FeaturesSlider from "../components/v3/FeaturesSlider";
import AIAssistant from "../components/v3/AIAssistant";

const FeaturedDoctors = lazy(() => import("../components/v3/FeaturedDoctors"));
const JoiningAsDoctor = lazy(() => import("./JoiningAsDoctor"));
const ReviewsGrid = lazy(() => import("../components/v3/ReviewsGrid"));
const BannerV2 = lazy(() => import("../components/v2/BannerV2"));

const SectionFallback = () => (
  <div className="flex items-center justify-center py-20">
    <div className="w-8 h-8 border-4 border-[#138C9F] border-t-transparent rounded-full animate-spin"></div>
  </div>
);

const HomeV3 = () => {
  const { t } = useTranslation();
  return (
    <div className="relative font-['Tajawal'] dark:bg-gray-900 dark:text-gray-200">
      <FramesSection />
      <FeaturesSlider />
      <AIAssistant />
      <Suspense fallback={<SectionFallback />}>
        <FeaturedDoctors />
        <JoiningAsDoctor />
        <ReviewsGrid />
        <BannerV2 />
      </Suspense>
    </div>
  );
};

export default HomeV3;
