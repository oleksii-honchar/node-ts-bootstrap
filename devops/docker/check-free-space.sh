#!/usr/bin/env bash
source ./devops/utils/console-colors.sh

spaceUsedPerc="$(df -Ph . | awk 'NR==2 {print $5}' | awk 'match($0, /[0-9]+/) { print substr( $0, RSTART, RLENGTH ) }')"

dockerImgCount="$(docker images -q | wc -l)"
danglingImgCount="$(docker images -f "dangling=true" -q | wc -l)"

echo "----------"
printf "${BOLDWHITE}Space used $YELLOW$spaceUsedPerc%%$NC ${BOLDWHITE}by $YELLOW$dockerImgCount$NC ${BOLDWHITE}docker images ($YELLOW$danglingImgCount$NC ${BOLDWHITE}dangling)$NC\n"
echo "----------"

if [ $spaceUsedPerc -ge 50 ] || [ $dockerImgCount -ge 30 ] || [ $danglingImgCount -ge 30 ]; then
    bash "./devops/docker/soft-cleanup.sh"
fi

