#include <stdio.h>
#include <stdlib.h>


int main(int argc, char *argv[]) {
	int n;
	scanf("%d",&n);
	int arr[n][n];
	int i,j;
	for ( i=1;i<=n;i++){
		for( j=1;j<=n;j++){
			arr[i][j]=i*j;
		}
	}
	while (1){
		int x,y;
		scanf("%d",&x);
		if (x==0){
			return 0;
		}
		scanf("%d",&y);
		printf("%d \n",arr[x][y]);
}
	return 0;
}
