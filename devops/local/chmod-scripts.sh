#!/usr/bin/env bash
source ./devops/utils/console-colors.sh

function chmodFile () {
    if [ ! -f ${1} ]; then
        printf "${YELLOW}${1} not found${NC}\n";
        return
    fi

    printf "chmod +x ${1}";

    if chmod +x ${1}; then
        printf " ${GREEN}[OK]${NC}\n";
    else
        printf " ${RED}[Error]${NC}\n";
    fi
}

printf "${LBLUE}Gonna make all this scripts executable ...${NC}\n";

currDir="$(pwd)"
printf "Base dir: $currDir\n";

printf "${GREEN}./devops/ci/${NC}\n";
chmodFile ./devops/ci/bump-version.sh
chmodFile ./devops/ci/check-free-space.sh
chmodFile ./devops/ci/deploy.dev.sh
chmodFile ./devops/ci/deploy.prod.sh
chmodFile ./devops/ci/deploy.qa.sh
chmodFile ./devops/ci/deploy.stage.sh
chmodFile ./devops/ci/get-latest-version.sh
chmodFile ./devops/ci/login-to-git.sh
chmodFile ./devops/ci/pipeline-dependency.sh
chmodFile ./devops/ci/post-jira-comment.sh
chmodFile ./devops/ci/semver.sh

printf "${GREEN}./devops/docker/${NC}\n";
chmodFile ./devops/docker/cleanup.sh
chmodFile ./devops/docker/cleanup-dungling.sh
chmodFile ./devops/docker/connect-bash.sh
chmodFile ./devops/docker/login-to-registry.sh
chmodFile ./devops/docker/pull-image.sh
chmodFile ./devops/docker/push-image.sh
chmodFile ./devops/docker/push-latest-image.sh
chmodFile ./devops/docker/rm-all.sh
chmodFile ./devops/docker/rm-all-volumes.sh
chmodFile ./devops/docker/run-bash.sh
chmodFile ./devops/docker/run-bash.loc.sh
chmodFile ./devops/docker/soft-cleanup.sh
chmodFile ./devops/docker/stop-all.sh

printf "${GREEN}./devops/local/${NC}\n";
chmodFile ./devops/local/check-env-vars.sh
chmodFile ./devops/local/load-project-env.sh

printf "${LBLUE}Done${NC}\n";
