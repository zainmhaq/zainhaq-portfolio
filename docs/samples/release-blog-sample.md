# Release Blog Writing Sample

Version 1.10.4 brings several new features that make it simpler for you to take advantage of the predictive modeling capabilities of DAI.

### Driverless AI GUI-based wizards

Several new GUI-based wizards have been added to DAI as part of this release.

**Experiment wizard:** This wizard guides you step-by-step through to process of setting up and starting an experiment. For users who aren’t already familiar with using DAI, the experiment wizard is a great way to start running experiments without having to worry about whether you’ve set up your experiment correctly.

If you’re an experienced user of DAI, you can still take advantage of this wizard to ensure that every aspect of your experiment has been configured correctly, especially in cases where you’re attempting to set up more complex experiments. Finally, if you’re used to only setting up a particular type of experiment, you can use this wizard to confidently try creating different types of experiments, like time series or NLP experiments.

To access the experiment wizard, go to the **Experiments** page and click **New Experiment -> Wizard Setup**.

**Dataset join wizard:** The process of joining two datasets together can sometimes be difficult, depending on the size and complexity of the datasets. This wizard guides you through this process so that you can be sure that the datasets are joined correctly.

To access the Dataset Join Wizard, go to the **Datasets** page and click on the name of the dataset, then click **Join Wizard** from the list of options.

**Leaderboard wizard:** This wizard helps you set up and perform a business value analysis of all models in a project. To access the Leaderboard wizard, go to a project and click the **Analyze Results** button.

### Expert Settings redesign

The Expert Settings window has been redesigned to make it simpler to navigate and locate specific settings that are relevant to your experiment. By clicking the **Filter by Tags** button, you can now also filter the list of available settings by specific tags. This is a useful way of ensuring that the settings being displayed are relevant to your particular use case.

### Improved model accuracy

H2O.ai developers conducted extensive research on the model accuracy of Driverless AI for multiple open source datasets, with a particular emphasis on the effectiveness of each phase of the experiment process. This research resulted in the identification of several improvements to the experiment process to make the experiment runtime considerably more effective.

Driverless AI now consistently drops models that have poor performance so that time is not wasted on unproductive models. We have also found more productive uses for certain feature transformers and algorithms, resulting in improved model performance across the board. These changes are especially helpful when working with smaller datasets.

All of the preceding changes have been incorporated into the experiment building process. By running experiments in Driverless AI 1.10.4, you will automatically benefit from these improvements.
