#!/bin/bash
set -e

source ./deploy-config.sh

BRANCH="master"
BUILD_FOLDER="build"
TEMP_FOLDER="temp"

# Ensure we're deploying from the correct branch.
CURRENT_BRANCH=$(git branch | grep \* | cut -d ' ' -f2)
if [[ "$CURRENT_BRANCH" != "$BRANCH" ]]; then
  printf "ERROR: This is not the $BRANCH branch.\n"
  exit
fi

# Show a warning if there are local changes.
HAS_CHANGES=$(git status --porcelain)
if [[ -n "$HAS_CHANGES" ]]; then
  echo -n "There are local changes. Enter [y] to continue anyway: "
  read CMD
  if [[ "$CMD" != "y" ]]; then
    printf "ERROR: Cancelled.\n"
    exit
  fi
fi

# Build.
if [[ -f "package.json" ]]; then
  yarn run build
fi

printf "Creating $BUILD_FOLDER.zip...\n"
zip -r "$BUILD_FOLDER.zip" "$BUILD_FOLDER" -x "*.DS_Store"

printf "\n\nCopying $BUILD_FOLDER.zip to $DEPLOY_FOLDER...\n"
scp "$BUILD_FOLDER.zip" "$DEPLOY_HOST:$DEPLOY_FOLDER"

printf "\n\nCreating $DEPLOY_FOLDER/$TEMP_FOLDER...\n"
ssh "$DEPLOY_HOST" "mkdir $DEPLOY_FOLDER/$TEMP_FOLDER"

printf "\n\nUnzipping $DEPLOY_FOLDER/$BUILD_FOLDER.zip...\n"
ssh "$DEPLOY_HOST" "unzip -q $DEPLOY_FOLDER/$BUILD_FOLDER.zip -d $DEPLOY_FOLDER/$TEMP_FOLDER"

if ssh "$DEPLOY_HOST" "[[ -d $DEPLOY_FOLDER/$BUILD_FOLDER ]]"; then
  printf "\n\nRemoving $DEPLOY_FOLDER/$BUILD_FOLDER...\n"
  ssh "$DEPLOY_HOST" "rm -rf $DEPLOY_FOLDER/$BUILD_FOLDER"
fi

printf "\n\nMoving $DEPLOY_FOLDER/$TEMP_FOLDER/$BUILD_FOLDER to $DEPLOY_FOLDER...\n"
ssh "$DEPLOY_HOST" "mv $DEPLOY_FOLDER/$TEMP_FOLDER/$BUILD_FOLDER $DEPLOY_FOLDER"

printf "\n\nRemoving $DEPLOY_FOLDER/$BUILD_FOLDER.zip...\n"
ssh "$DEPLOY_HOST" "rm $DEPLOY_FOLDER/$BUILD_FOLDER.zip"

printf "\n\nRemoving $DEPLOY_FOLDER/$TEMP_FOLDER...\n"
ssh "$DEPLOY_HOST" "rmdir $DEPLOY_FOLDER/$TEMP_FOLDER"

printf "\n\nRemoving $BUILD_FOLDER.zip...\n"
rm "$BUILD_FOLDER.zip"

printf "\n\nCopying .gitcommit...\n"
echo $(git rev-parse HEAD) > .gitcommit
scp .gitcommit "$DEPLOY_HOST:$DEPLOY_FOLDER"
