#define _CRT_SECURE_NO_WARNINGS
#include <iostream>
#include <stdio.h>
using namespace std;
int a[11];
void part(int L) {
	if (L != 1) {
		int i = L - 2;
		int S = a[L - 1];
		while (i > 0 && a[i] == a[i - 1]) {
			S += a[i];
			i--;
		}
		a[i]++;
		L = i + S;
		for (int j = i + 1; j < L; j++)
			a[j] = 1;
		for (int j = 0;j<L;j++)
			cout << a[j] << " ";
		cout << '\n';
		part(L);
	}
}

int main() {
	freopen("input.txt", "rt", stdin);
	freopen("output.txt", "wt", stdout);
	int n;
	cin >> n;
	for (int i = 0; i < n; i++) {
		a[i] = 1;
		cout << a[i] <<  " ";
	}
	cout << '\n';
	part(n);
}