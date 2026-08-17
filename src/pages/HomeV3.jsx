import React from "react";
import { useTranslation } from "react-i18next";
import FramesSection from "../components/v3/FramesSection";
import FeaturesSlider from "../components/v3/FeaturesSlider";
import FeaturedDoctors from "../components/v3/FeaturedDoctors";
import AIAssistant from "../components/v3/AIAssistant";
import JoiningAsDoctor from "./JoiningAsDoctor";
import ReviewsGrid from "../components/v3/ReviewsGrid";
import BannerV2 from "../components/v2/BannerV2";

const HomeV3 = () => {
  const { t } = useTranslation();
  return (
    <div className="relative font-['Cairo'] dark:bg-gray-900 dark:text-gray-200">
      <FramesSection />
      <FeaturesSlider />
      <AIAssistant />
      <FeaturedDoctors />
      <JoiningAsDoctor />
      <ReviewsGrid />
      <BannerV2 />
    </div>
  );
};

export default HomeV3;
