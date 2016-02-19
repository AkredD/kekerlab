#include <stdio.h>
#include <malloc.h>

int main(int argc, char *argv[]) {
	int n;
	scanf("%d",&n);
	int i,j;
	int **arr = (int **)malloc((n+1) * sizeof(int *)); 
	for(i = 0; i <= n; i++) {
		  arr[i] = (int *)malloc(n * sizeof(int));
	}
	for ( i=1;i<=n;i++){
		for( j=1;j<=n;j++){
			arr[i][j] = i * j;
		}
	}
	while (1){
		int x1,y1,x2,y2;
		scanf("%d",&x1);
		if (x1==0){
			free(arr);
			return 0;
		}
		scanf("%d%d%d",&y1,&x2,&y2);
		for (i=y1;i<=y2;++i){
			for(j=x1;j<=x2;++j){
				printf("%d ",arr[i][j]);
			}
			printf("\n");
		}
		
	}
	return 0;
}
