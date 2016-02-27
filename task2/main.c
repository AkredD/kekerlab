#include <stdio.h>
#include <string.h>
#include <malloc.h>
#include <ctype.h>
#include <stdlib.h>
char last;
FILE *pf; 
FILE *pr; 

int checkcom(char *command,int l,int i){
	if (l==0){
		int h=0;
		int hh=0;
		while(command[i]!=' '){
			char te=command[i++];
			if ((te >='a' && te<='z') || (te>='A' && te<='Z')){
				continue;
			}else{
				printf("incorrect input\n");
				return 0;
			}
		}
		++i;
		while(command[i]!='\n'){
			char te=command[i++];
			if ((te >='0' && te<='9') || (te=='+')){
				continue;
			}else{
				printf("incorrect input\n");
				return 0;
			}
		}
	}
	if (l==1){
		int check=1; 
			int j=0;
			if ((command[i]>='0' && command[i]<='9') || command[i]=='+') check=0;
			while(command[i]!='\n'){
				char te=command[i++];
				if (check){
					if ((te >='a' && te<='z') || (te>='A' && te<='Z')){
						continue;
					}else{
						printf("incorrect input\n");
						return 0;
					}
				}else{
					if ((te >='0' && te<='9') || (te=='+')){
						continue;
					}else{
						printf("incorrect input\n");
						return 0;
					}
				}
			}
	}
	if(l==2){
		if (command[i]>='0' && command[i+1]=='\n') return 1;
		printf("incorrect input\n");
		return 0;
	}
	if (l==3){
		if (command[i]>='0' && command[i+1]==' '){
			i+=2;
			int check=1; 
			int j=0;
			if ((command[i]>='0' && command[i]<='9') || command[i]=='+') check=0;
			while(command[i]!='\n'){
				char te=command[i++];
				if (check){
					if ((te >='a' && te<='z') || (te>='A' && te<='Z')){
						continue;
					}else{
						printf("incorrect input\n");
						return 0;
					}
				}else{
					if ((te >='0' && te<='9') || (te=='+')){
						continue;
					}else{
						printf("incorrect input\n");
						return 0;
					}
				}
			}
		}else{
			printf("incorrect input\n");
			return 0;
		}
	}
	return 1;
}

int strings(char *s,char *c,int k){
	int lens,lenc;
	int i;
	if (k==2){
		for (lens=0;s[lens]!='$';++lens);
		for (lenc=0;c[lenc]!='$';++lenc);
	}
	if (k==1){
		lenc=strlen(c);
		lens=strlen(s)-1;
	}
	if (k==0){
		lenc=strlen(c);
		for(lens=0;s[lens]!='$';++lens);
	}
	if (lenc==lens){
		for (i=0;i<lenc;++i){
			if (s[i]!=c[i]){
				return 0;
			}
		}	
	}else{
			return 0;
	}
 
	return 1;
}

int checkstr(char *s,char *c){
	int k=0;
	int i,j,lenc,lens;
	for (lens=0;s[lens]!='$';++lens);
	for (lenc=0;c[lenc]!='$';++lenc);
	for (i=0;i<lens-lenc+1;++i){
		int d=0;
		char *checkc = (char *)malloc((lenc) * sizeof(int));
		for (j=i;j<i+lenc;++j){
			checkc[j-i]=s[j];
		}
		for (j=0;j<lenc;++j){
			if (checkc[j]==c[j]) {
				d=1;
			}else{
				d=0;
				break;
			}
		}
		if (d==1) ++k;
	}
	return k;
}

char *create(int i,char *command, char *merge){
	int j=0;
	merge[j]='$'; merge[++j]=last++;
	++j;
	for(i++;command[i]!=' ';++i,++j){
        merge[j]=command[i];
	}
	merge[j]='$';
	++j;
	for(i++;i<(strlen(command)-1);++i){
		if ((command[i]>='0' && command[i]<='9') || command[i]=='+'){
			merge[j]=command[i];
			++j;
		}
			
	}
	merge[j]='$';
	return merge;
}

void find(char *command,int i){
	char *str = (char *)malloc((BUFSIZ) * sizeof(char));
	int j=0;
	int check=1; 
	char *test = (char *)malloc((BUFSIZ) * sizeof(char));
	if ((command[i]>='0' && command[i]<='9') || command[i]=='+') check=0;
	while(command[i]!='\n'){
		test[j++]=command[i++];
	}
	test[j]='$';
	rewind(pf);
	while (fgets(str,BUFSIZ,pf)){
		j=0;
		i=0;
		char *name = (char *)malloc((BUFSIZ) * sizeof(char));
		char *number = (char *)malloc((BUFSIZ) * sizeof(char));
		char id;
		if (str[j++]=='$'){
			id=str[j++];
			while(1){
				if (str[j]!='$'){
					name[i]=str[j++];
					++i;
				}else{
					name[i]='$';
					++j;
					break;
				}
			}
			int nameM=i;
			i=0;
			while(1){
				if (str[j]!='$'){
					number[i]=str[j++];
					++i;
				}else{
					number[i]='$';
					break;
				}
			}
			int nameN=i;
			if (check){
				if (checkstr(name,test)){
					name[nameM]=' ';
					number[nameN]=' ';
					printf("%c %s%s \n",id,name,number);
				}
			}else{
				if (strings(number,test,2)){
					number[nameN]=' ';
					name[nameM]=' ';
					printf("%c %s%s\n",id,name,number);
				}
			}
		}
		free(name);
		free(number);
	}
	free(test);
	free(str);
	return;
}

void deletE(char idN){
	char *str = (char *)malloc((BUFSIZ) * sizeof(char));
	pr=fopen("new2.txt","w");
	pr=fopen("new2.txt","r+");
	rewind(pf);
	while (fgets(str,BUFSIZ,pf)){
		int	j=0;
		int i=0;
		char *name = (char *)malloc((BUFSIZ) * sizeof(char));
		char *number = (char *)malloc((BUFSIZ) * sizeof(char));
		char id;
		if (str[j++]=='$'){
			id=str[j++];
			while(1){
				if (str[j]!='$'){
					name[i]=str[j++];
					++i;
				}else{
					name[i]='$';
					++j;
					break;
				}
			}
			i=0;
			while(1){
				if (str[j]!='$'){
					number[i]=str[j++];
					++i;
				}else{
					number[i]='$';
					break;
				}
			}
			if (id!=idN){
				fprintf(pr,"$%c%s%s\n",id,name,number);
			}
		}
		free(str);
		char *str = (char *)malloc((BUFSIZ) * sizeof(char));
		free(name);
		free(number);
	}
	free(str);
	rewind(pr);
	pf=fopen("new1.txt","w");
	pf=fopen("new1.txt","r+");
	char *line = (char *)malloc((BUFSIZ) * sizeof(char));
	while (fgets(line,BUFSIZ,pr)){
		fprintf(pf,"%s\n",line);
		free(line);
		char *line = (char *)malloc((BUFSIZ) * sizeof(char));
	}
	free(line);
	fclose(pr); 
	return;
}

void change(char *command,char idN,int i){
	int check=1; 
	int j=0;
	char *test = (char *)malloc((BUFSIZ) * sizeof(char));
	if ((command[i]>='0' && command[i]<='9') || command[i]=='+') check=0;
	while(command[i]!='\n'){
		test[j++]=command[i++];
	}
	test[j]='$';
	char *str = (char *)malloc((BUFSIZ) * sizeof(char));
	pr=fopen("new2.txt","w");
	pr=fopen("new2.txt","r+");
	rewind(pf);
	while (fgets(str,BUFSIZ,pf)){
		j=0;
		int i=0;
		char *name = (char *)malloc((BUFSIZ) * sizeof(char));
		char *number = (char *)malloc((BUFSIZ) * sizeof(char));
		char id;
		if (str[j++]=='$'){
			id=str[j++];
			while(1){
				if (str[j]!='$'){
					name[i]=str[j++];
					++i;
				}else{
					name[i]='$';
					++j;
					break;
				}
			}
			i=0;
			while(1){
				if (str[j]!='$'){
					number[i]=str[j++];
					++i;
				}else{
					number[i]='$';
					break;
				}
			}
			if (id==idN){
				if (check){
					fprintf(pr,"$%c%s%s\n",id,test,number);
				}else{
					fprintf(pr,"$%c%s%s\n",id,name,test);
				}
			}else{
				fprintf(pr,"$%c%s%s\n",id,name,number);
				printf("$%c%s%s\n",id,name,number);
			}
		}
		free(str);
		char *str = (char *)malloc((BUFSIZ) * sizeof(char));
		free(name);
		free(number);
	}
	free(str);
	rewind(pr);
	pf=fopen("new1.txt","w");
	pf=fopen("new1.txt","r+");
	char *line = (char *)malloc((BUFSIZ) * sizeof(char));
	while (fgets(line,BUFSIZ,pr)){
		fprintf(pf,"%s\n",line);
		free(line);
		char *line = (char *)malloc((BUFSIZ) * sizeof(char));
	}
	free(test);
	free(line);
	fclose(pr); 
	return;
}

int main(){
	last='0';
	pf=fopen("new1.txt","w");
	pf=fopen("new1.txt","r+");
	int i,j;
	
	while(1){
		int ex=1;
		fflush(stdin);
		char *command = (char *)malloc((BUFSIZ) * sizeof(char));
		char *com = (char *)malloc((BUFSIZ) * sizeof(char));
		fgets(command,BUFSIZ,stdin);
		if (strings(command,"exit",1)) {
			free(command);
			free(com);
			ex=0;
			break;
		}
		for(i=0;command[i]!=' ';++i){ //!!!11
			com[i]=command[i];
		}
		com[i]='$';
		int h=i;
		if(strings(com,"create",0)){
			ex=0;
			char *merge = (char *)malloc((BUFSIZ) * sizeof(char));
			if (checkcom(command,0,i+1)) fprintf(pf,"%s \n",create(i,command,merge));
			free(merge);
		}
		
		if(strings(com,"find",0)){
			ex=0;
			if (checkcom(command,1,i+1)) find(command,i+1);
		}
		if(strings(com,"delete",0)){
			ex=0;
			char id=command[i+1];
			if (checkcom(command,2,i+1)) deletE(id);
		}
		if(strings(com,"change",0)){
			ex=0;
			char id=command[++i];
			if (checkcom(command,3,i)) change(command,id,i+2);
		}
		if(ex) printf("incorrect input\n");
		free(command);
		free(com);
	}
	fclose(pf); 
	return 0;
}
